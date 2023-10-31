from datetime import datetime

import torch.optim
from PIL import Image
from torch import optim, nn
from torch.utils.data import DataLoader
import torchvision.datasets as datasets
from mnist.MyMNISTModel import MyMNISTModel
from torchvision import transforms

def train(num_epochs, model, train_loader, optimizer, loss_function, device):
    model.train()  # Set the model in training mode

    for epoch in range(num_epochs):
        total_loss = 0

        for batch_idx, (data, target) in enumerate(train_loader):
            data, target = data.to(device), target.to(device)

            # Zero the gradients
            optimizer.zero_grad()

            # Forward pass
            output = model(data)

            # Calculate the loss
            loss = loss_function(output, target)

            # Backpropagation
            loss.backward()

            # Update the weights
            optimizer.step()

            total_loss += loss.item()

            # Print progress every so often
            if batch_idx % 100 == 0:
                print(f"Epoch {epoch + 1}/{num_epochs}, Batch {batch_idx}/{len(train_loader)}, Loss: {loss.item():.4f}")

        # Print the average loss for the epoch
        avg_loss = total_loss / len(train_loader)
        print(f"Epoch {epoch + 1}/{num_epochs}, Average Loss: {avg_loss:.4f}")
    torch.save(model.state_dict(), 'model_' + str(datetime.utcnow().strftime('%m_%d%_H_%M_%S')) + '.pth')

def test(model, test_loader, device):
    model.eval()

    correct = 0
    total = 0

    with torch.no_grad():
        for data, target in test_loader:
            data, target = data.to(device), target.to(device)

            # Forward pass
            output = model(data)

            # Get predicted labels
            _, predicted = torch.max(output.data, 1)

            total += target.size(0)
            correct += (predicted == target).sum().item()

    accuracy = 100 * correct / total
    print(f"Test Accuracy: {accuracy:.2f}%")

if __name__ == '__main__':
    epochs = 5
    learning_rate = 0.001
    batch_size = 64
    model = MyMNISTModel()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    error = nn.CrossEntropyLoss()

    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"= Using device {device}")
    model.to(device)

    mnist_download_root = "./mnist/"
    mnist_trainset = datasets.MNIST(root='./data', train=True, download=True, transform=transforms.Compose([
        # you can add other transformations in this list
        transforms.ToTensor()
    ]))
    mnist_testset = datasets.MNIST(root='./data', train=False, download=True, transform=transforms.Compose([
        # you can add other transformations in this list
        transforms.ToTensor()
    ]))

    train_loader = DataLoader(
        mnist_trainset,
        batch_size=batch_size,
        shuffle=True,
        pin_memory=True,
        num_workers=4,
        drop_last=True
    )

    test_loader = DataLoader(
        mnist_testset,
        batch_size=batch_size,
        shuffle=True,
        pin_memory=True,
        num_workers=1
    )

    train(epochs, model, train_loader, optimizer, error, device)
    test(model, test_loader, device)