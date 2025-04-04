class ViTBinaryClassifier(nn.Module):
    def __init__(self, pretrained=True):
        super(ViTBinaryClassifier, self).__init__()
        self.backbone = timm.create_model("vit_medium_patch16_224", pretrained=pretrained)
        in_features = self.backbone.head.in_features
        self.backbone.head = nn.Identity() 
        self.classifier = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 1),
            nn.Sigmoid() 
        )
        
    def forward(self, x):
        features = self.backbone(x)
        out = self.classifier(features)
        return out