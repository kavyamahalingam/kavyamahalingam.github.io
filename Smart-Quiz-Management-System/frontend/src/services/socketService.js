import { io } from 'socket.io-client';

// Use environment variable or current origin for proxying
const SOCKET_URL = import.meta.env.VITE_API_URL || window.location.origin;

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('Connected to real-time engine');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from real-time engine');
      });
    }
    return this.socket;
  }

  joinExam(examId, userId, userName) {
    if (this.socket) {
      this.socket.emit('join_exam', { exam_id: examId, user_id: userId, user_name: userName });
    }
  }

  updateProgress(examId, userId, progress) {
    if (this.socket) {
      this.socket.emit('update_progress', { exam_id: examId, user_id: userId, progress: progress });
    }
  }

  examFinished(examId, userId, score, userName) {
    if (this.socket) {
      this.socket.emit('exam_finished', { exam_id: examId, user_id: userId, score: score, user_name: userName });
    }
  }

  leaveExam(examId, userId) {
    if (this.socket) {
      this.socket.emit('leave_exam', { exam_id: examId, user_id: userId });
    }
  }

  onActiveUsers(callback) {
    if (this.socket) {
      this.socket.on('active_users_update', callback);
    }
  }

  onNewScore(callback) {
    if (this.socket) {
      this.socket.on('new_score_recorded', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
