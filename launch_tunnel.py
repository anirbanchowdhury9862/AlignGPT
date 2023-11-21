from threading import Thread
import os
FLASK_PORT=5000
FLASK_SUBDOMAIN="darkneuron1"
TFX_PORT=8501
TFX_SUBDOMAIN="darknet"

def tunnel_tfx():
    os.system("lt --subdomain {} -p {}".format(TFX_SUBDOMAIN,TFX_PORT))
    while 1:
        pass

def tunnel_flask():
    os.system("lt --subdomain {} -p {}".format(FLASK_SUBDOMAIN,FLASK_PORT))
    while 1:
        pass
def launch_flask():
    os.system("python server.py")
    while 1:pass

def launch_tfx():
    os.system("bash serve_model.sh")
    while 1:pass

FLASK_PORT=5000
TFX_PORT=8501
TASKS=[launch_flask,launch_tfx,tunnel_flask,tunnel_tfx]
tasks=list(map(lambda target_fn:Thread(target=target_fn),TASKS))
for task in tasks:
    task.start()
for task in tasks:
    task.join()
    