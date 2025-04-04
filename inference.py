
import os
import torch
from torchvision import models, transforms
from torch.utils.data import Dataset, DataLoader
from PIL import Image
import pandas as pd

class InferenceDataset(Dataset):
    def __init__(self, folder, transform):
        self.paths = [os.path.join(folder, f) for f in os.listdir(folder)
                      if f.lower().endswith(("png", "jpg", "jpeg"))]
        self.transform = transform

    def __len__(self):
        return len(self.paths)

    def __getitem__(self, idx):
        img = Image.open(self.paths[idx]).convert("RGB")
        return self.transform(img), self.paths[idx]

def run_inference(image_folder, output_csv="predictions.csv"):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = models.resnet18(pretrained=True)
    for p in model.parameters():
        p.requires_grad = False
    model.fc = torch.nn.Linear(model.fc.in_features, 1)
    model = model.to(device)
    model.eval()

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])

    dataset = InferenceDataset(image_folder, transform)
    loader = DataLoader(dataset, batch_size=1, shuffle=False)

    results = []
    with torch.no_grad():
        for img, path in loader:
            img = img.to(device)
            pred = torch.sigmoid(model(img)).item()
            label = "Dog" if pred >= 0.5 else "Cat"
            results.append({"image_path": path[0], "prediction": label, "score": pred})

    pd.DataFrame(results).to_csv(output_csv, index=False)
