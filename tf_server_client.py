import json
import requests
if __name__=='__main__':
    import tensorflow as tf
    (_,_),(x,y)=tf.keras.datasets.mnist.load_data()
    #headers = {"content-type": "application/json"}
    #if it the tf-server is in cloud shell
    json_response = requests.post('http://localhost:8501/v1/models/digit_model:predict', data=json.dumps({'instances':x[:3].tolist()}))
    #if it the tf-server is in compute engine
    #set ip forwarding 1 in compute engine and create new firewall rule to allow all ingress traffic as by-default http traffic
    #is off in compute-engine
    #json_response = requests.post('http://34.93.154.34:8501/v1/models/digit_model:predict', data=json.dumps({'instances':x[:3].tolist()}))

    print(tf.argmax(json.loads(json_response.text)['predictions'],1),y[:3])
    #predictions = json.loads(json_response.text)['predictions']
