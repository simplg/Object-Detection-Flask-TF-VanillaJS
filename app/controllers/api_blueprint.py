import base64
from six import BytesIO
from PIL import Image
from flask import Blueprint, request, jsonify
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as viz_utils
import numpy as np
from app.services import model_manager

category_index = label_map_util.create_category_index_from_labelmap("./ml/mscoco_complete_label_map.pbtxt", use_display_name=True)

COCO17_HUMAN_POSE_KEYPOINTS = [(0, 1),
 (0, 2),
 (1, 3),
 (2, 4),
 (0, 5),
 (0, 6),
 (5, 7),
 (7, 9),
 (6, 8),
 (8, 10),
 (5, 6),
 (5, 11),
 (6, 12),
 (11, 12),
 (11, 13),
 (13, 15),
 (12, 14),
 (14, 16)]

def allowed_file(filename: str, allowed_ext: set[str] = {'png', 'jpg', 'jpeg'}):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_ext

api_router = Blueprint("api", __name__, url_prefix="/api")

@api_router.route("/predict", methods=["POST"])
def predict():

    if 'image' not in request.files or request.files['image'].filename == '':
        return jsonify(error="Need an image to predict anything")
    
    image = request.files["image"]

    if not allowed_file(image.filename):
        return jsonify(error="The image must be a png, jpg or jpeg")
    
    img_data = BytesIO(image.read())
    img = Image.open(img_data)
    (im_width, im_height) = img.size
    img_np = np.array(img.getdata()).reshape((1, im_height, im_width, 3)).astype(np.uint8)

    results = model_manager.model(img_np)
    result = {key:value.numpy() for key,value in results.items()}
    img_with_boxes = Image.fromarray(build_image(result, img_np).astype('uint8'), 'RGB')
    buffered = BytesIO()
    img_with_boxes.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue())
    result = [category_index[cls] for cls in result["detection_classes"][0].tolist()]


    return jsonify(result=result, image="data:image/jpeg;base64," + img_str.decode("utf-8"))


def build_image(result: dict, img_np: np.array):
    img_copy = img_np.copy()
    # Use keypoints if available in detections
    keypoints, keypoint_scores = None, None
    if 'detection_keypoints' in result:
        keypoints = result['detection_keypoints'][0]
        keypoint_scores = result['detection_keypoint_scores'][0]

    viz_utils.visualize_boxes_and_labels_on_image_array(
        img_copy[0],
        result['detection_boxes'][0],
        (result['detection_classes'][0]).astype(int),
        result['detection_scores'][0],
        category_index,
        use_normalized_coordinates=True,
        max_boxes_to_draw=200,
        min_score_thresh=.30,
        agnostic_mode=False,
        keypoints=keypoints,
        keypoint_scores=keypoint_scores,
        keypoint_edges=COCO17_HUMAN_POSE_KEYPOINTS)
    return img_copy[0]