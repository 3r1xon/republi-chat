import os
import subprocess
import threading
import time

class Start:
    def __init__(self):
        TD_C = threading.Thread(target=self.startClient, args=())
        TD_C.start()

        time.sleep(1)

        TD_S = threading.Thread(target=self.startServer, args=())
        TD_S.start()



    def checkNodeModules(self):
        node_modules = os.path.exists("node_modules")

        if not node_modules:
            os.system("npm i")



    def startClient(self):
        root_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "ClientApp")

        os.chdir(root_path)

        self.checkNodeModules()

        os.system("ng serve")



    def startServer(self):
        root_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "Server")

        os.chdir(root_path)

        self.checkNodeModules()

        os.system("nodemon start.js")



    def startMariaDB(self):
        pass



Start()