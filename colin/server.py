import socket, time, struct, threading, pathlib
#from cli import CommandLineInterface
from .utils import Connection, Listener
from . import Thought

#cli = CommandLineInterface()
HEADER_SIZE = 20


class Handler(threading.Thread):
	lock = threading.Lock()
	def __init__(self, client, data_dir):
		super().__init__()
		self.client = client
		self.data_dir = data_dir

	def run(self):
		with self.client:
			# Receive message
			header = self.client.receive(HEADER_SIZE)
			user_id, timestamp, thought_size =  struct.unpack('QQI', header)
			thought = self.client.receive(thought_size).decode('utf-8')
			
		#TODO: figure out exception handling

		# Save message
		timestamp = time.strftime('%Y-%m-%d_%H-%M-%S', time.localtime(timestamp))
		dir_path = f'{self.data_dir}/{user_id}'
		with Handler.lock:
			self.save_file(dir_path, timestamp, thought)


	def save_file(self, dir_path, filename, data):
		# Make directory
		dir_path = pathlib.Path(dir_path)
		if not dir_path.exists():
			dir_path.mkdir()
		file_path = dir_path / f'{filename}.txt'

		# Write file
		if not file_path.exists():
			file_path.touch()
			with file_path.open('w') as file:
				file.write(data)
		else:
			with file_path.open('a') as file:
				file.write('\n' + data)
		

def run_server(address, data_dir):
	host, port = address
	# Setup server
	with Listener(host=host, port=port) as server:
		while True:
			# Recieve message
			client = server.accept()
			handler = Handler(client, data_dir)
			handler.start()
