import socket
import struct


class Connection:
    def __init__(self, socket):
        self.socket = socket

    @classmethod
    def connect(cls, host, port):
        sock = socket.socket()
        sock.connect((host, port))
        return Connection(sock)

    def __repr__(self):
        lip, lport = self.socket.getsockname()
        rip, rport = self.socket.getpeername()
        return f'<Connection from {lip}:{lport} to {rip}:{rport}>'

    def __enter__(self):
        return self

    def __exit__(self, exception, error, traceback):
        self.close()

    def receive(self, size):
        data = b''
        while len(data) < size:
            received = self.socket.recv(1)
            if not received:
                raise Exception('Incomplete data')
            data += received
        return data

    def send_message(self, message):
        data = b''
        bmessage = bytes(message, 'utf-8')
        data += struct.pack('I', len(bmessage))
        data += bmessage
        self.socket.sendall(data)

    def receive_message(self):
        size = struct.unpack('I', self.socket.recv(8))
        return self.receive(size)

    def close(self):
        self.socket.close()
