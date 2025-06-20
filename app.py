from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.secret_key = 'your_secret_key'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

# 當有新線條時，廣播給所有人
@socketio.on('draw_line')
def handle_draw_line(data):
    emit('draw_line', data, broadcast=True, include_self=False)

if __name__ == '__main__':
    socketio.run(app, debug=True)