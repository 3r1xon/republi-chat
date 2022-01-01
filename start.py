import os
import threading
import time
import sys
import ctypes
import shutil


client_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "ClientApp")

server_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "Server")

class Start:
    def __init__(self):
        for param in sys.argv:

            param = param.lower()

            if param == "-d":

                print("Removing ClientApp node modules...")
                shutil.rmtree(client_path + "\\node_modules")
                print("ClientApp node modules removed.")

                print("Removing Server node modules...")
                shutil.rmtree(server_path + "\\node_modules")
                print("Server node modules removed.")
                return

            if param == "-i":
                print("Installing node modules...")
                os.chdir(client_path)
                self.checkNodeModules()

                os.chdir(server_path)
                self.checkNodeModules()
                return



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
        os.chdir(client_path)

        self.checkNodeModules()

        os.system("ng serve")



    def startServer(self):
        os.chdir(server_path)

        self.checkNodeModules()

        os.system("nodemon start.js")



    def startMariaDB(self):
        pass

if __name__ == "__main__":
    Start()