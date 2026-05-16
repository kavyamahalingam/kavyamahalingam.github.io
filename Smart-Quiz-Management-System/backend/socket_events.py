from extensions import socketio
from flask_socketio import emit, join_room, leave_room
from flask import request
import logging

logger = logging.getLogger(__name__)

# Keep track of active users in memory (for real-time tracking)
# In production, use Redis
active_exams = {} # {exam_id: {user_id: {name, progress}}}

@socketio.on('connect')
def handle_connect():
    logger.info(f"Client connected: {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    logger.info(f"Client disconnected: {request.sid}")
    # Cleanup if needed (find user by sid and remove from active_exams)

@socketio.on('join_exam')
def on_join(data):
    exam_id = data.get('exam_id')
    user_id = data.get('user_id')
    user_name = data.get('user_name', 'Anonymous')
    
    if not exam_id or not user_id:
        return
    
    room = f"exam_{exam_id}"
    join_room(room)
    
    if exam_id not in active_exams:
        active_exams[exam_id] = {}
    
    active_exams[exam_id][user_id] = {
        'name': user_name,
        'progress': 0,
        'sid': request.sid
    }
    
    # Broadcast updated count to the room
    emit('active_users_update', {
        'count': len(active_exams[exam_id]),
        'users': [u['name'] for u in active_exams[exam_id].values()]
    }, room=room)
    
    logger.info(f"User {user_id} joined exam room {room}")

@socketio.on('update_progress')
def on_progress(data):
    exam_id = data.get('exam_id')
    user_id = data.get('user_id')
    progress = data.get('progress', 0) # e.g. 50%
    
    if exam_id in active_exams and user_id in active_exams[exam_id]:
        active_exams[exam_id][user_id]['progress'] = progress
        
        # Optionally broadcast progress to an admin dashboard
        emit('user_progress_update', {
            'user_id': user_id,
            'name': active_exams[exam_id][user_id]['name'],
            'progress': progress
        }, room=f"admin_exam_{exam_id}")

@socketio.on('exam_finished')
def on_finished(data):
    exam_id = data.get('exam_id')
    user_id = data.get('user_id')
    score = data.get('score', 0)
    user_name = data.get('user_name', 'Anonymous')
    
    room = f"exam_{exam_id}"
    
    # Broadcast to everyone in the exam that someone finished (Leaderboard update)
    emit('new_score_recorded', {
        'name': user_name,
        'score': score
    }, room=room)
    
    # Remove from active list
    if exam_id in active_exams and user_id in active_exams[exam_id]:
        del active_exams[exam_id][user_id]
        
    emit('active_users_update', {
        'count': len(active_exams.get(exam_id, {})),
        'users': [u['name'] for u in active_exams.get(exam_id, {}).values()]
    }, room=room)

@socketio.on('leave_exam')
def on_leave(data):
    exam_id = data.get('exam_id')
    user_id = data.get('user_id')
    room = f"exam_{exam_id}"
    leave_room(room)
    
    if exam_id in active_exams and user_id in active_exams[exam_id]:
        del active_exams[exam_id][user_id]
        
    emit('active_users_update', {
        'count': len(active_exams.get(exam_id, {})),
        'users': [u['name'] for u in active_exams.get(exam_id, {}).values()]
    }, room=room)
