from flask import Blueprint
from flask.templating import render_template

main_router = Blueprint("main", __name__, url_prefix="/")

@main_router.route("/")
def index():
    return render_template("index.html")