import io

import torch
from PIL import Image
from torch import nn
import torch.nn.functional as f
from torchvision.transforms import transforms
from io import BytesIO

class MyMNISTModel(nn.Module):
    def __init__(self):
        super(MyMNISTModel, self).__init__()
        self.conv1 = nn.Conv2d(1, 10, kernel_size=5)
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5)
        self.conv2_drop = nn.Dropout2d()
        self.fc1 = nn.Linear(320, 50)
        self.fc2 = nn.Linear(50, 10)

    def forward(self, x):
        x = f.relu(f.max_pool2d(self.conv1(x), 2))
        x = f.relu(f.max_pool2d(self.conv2_drop(self.conv2(x)), 2))
        x = x.view(-1, 320)
        x = f.relu(self.fc1(x))
        x = f.dropout(x, training=self.training)
        x = self.fc2(x)
        x = f.log_softmax(x, dim=1)
        return x

    def test_model_from_file(model_file, input_image_file):
        # Load the PyTorch model from file
        model = MyMNISTModel()
        model.load_state_dict(torch.load(model_file, map_location=torch.device('cpu')))
        model.eval()  # Set the model in evaluation mode

        try:
            # Load the image from the input_image_file
            image = Image.open(io.BytesIO(input_image_file))

            # Preprocess the image (resize, convert to grayscale, normalize, and convert to tensor)
            transform = transforms.Compose([
                transforms.Resize((28, 28)),
                transforms.Grayscale(num_output_channels=1),
                transforms.ToTensor(),
                transforms.Normalize((0.1307,), (0.3081,))
            ])
            image = transform(image)

            # Make a prediction using the model
            with torch.no_grad():
                output = model(image.unsqueeze(0))  # Add a batch dimension

            # Get the predicted class label
            _, predicted_class = output.max(1)

            return str(predicted_class.item())
        except Exception as exc:
            return str(exc)
