import tensorflow_hub as hub
from flask import Flask

class ModelManager():

    def __init__(self):
        self.__model = None

    def init_app(self, app: Flask):
        self.__model_path = app.config.get("TENSORFLOW_MODEL_PATH", "https://tfhub.dev/tensorflow/faster_rcnn/inception_resnet_v2_640x640/1")
        self.__model = hub.load(self.__model_path)

    @property
    def model(self):
        return self.__model