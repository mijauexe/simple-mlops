from flask import Flask, request
import json
import base64

from MyMNISTModel import MyMNISTModel
app = Flask(__name__)

@app.route('/flask', methods=['GET'])
def index():
    return "Flask server"

@app.route('/test-model', methods=['POST'])
def test_model():
    try:
        req = json.loads(request.data)
        b64_img = req["img"]
        img = base64.b64decode(b64_img)
        digit = MyMNISTModel.test_model_from_file(f'./model.pth', img)
        return {'digit' : digit}
    except Exception as exc:
        return {'error' : str(exc)}

if __name__ == "__main__":
    app.run(port=5000, debug=True)