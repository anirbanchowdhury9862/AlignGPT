import tensorflow as tf
import json 
import requests

class lenet:
    def __init__(self,url):
        self.servable=url
    
    def __preprocess(self,data):
        img=tf.image.rgb_to_grayscale(data)
        img=tf.image.resize(img,(28,28))
        img=tf.expand_dims(img,0)
        return img

    def __call__(self,INPUT):
        data=tf.cast(self.__preprocess(INPUT),tf.uint8)
        json_response = requests.post(self.servable, data=json.dumps({'instances':data.numpy().tolist()}))
        #print(data.dtype,json_response.text)
        op=tf.argmax(json.loads(json_response.text)['predictions'],1)
        
        return op[0].numpy()

if __name__=='__main__':
    img=np.ones((500,500,3))
    model=lenet('custom_net')
    print(model(img))