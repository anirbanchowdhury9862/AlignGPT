from flask import Flask,render_template,request,jsonify
import numpy as np
from image_process import lenet
#import matplotlib.pyplot as plt
servable_model_url='http://localhost:8501/v1/models/digit_model:predict'
model=lenet(servable_model_url)

app=Flask(__name__)

@app.route("/",methods=['GET','POST'])
def home():
    val=render_template("index.html")
    return val
@app.route("/digit_paint",methods=['GET','POST'])
def load_paint_app():
    return render_template("paint_app.html")
@app.route("/pose_estimation",methods=['GET','POST'])
def load_pose_estimation_app():
    return render_template("pose_estimation.html")
if __name__=='__main__':
	app.run(debug=True)