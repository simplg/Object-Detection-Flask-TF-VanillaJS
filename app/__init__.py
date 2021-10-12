from flask import Flask
from app.services import model_manager
from app.controllers.api_blueprint import api_router
from app.controllers.main_blueprint import main_router

def create_app(test_config=None):
    app = Flask(__name__)

    model_manager.init_app(app)

    app.register_blueprint(api_router)
    app.register_blueprint(main_router)

    return app