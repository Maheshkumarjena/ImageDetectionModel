DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
LEARNING_RATE = 0.001
WEIGHT_DECAY = 0.0001
BATCH_SIZE = 32
NUM_EPOCHS = 100
IMAGE_SIZE = 72
PATCH_SIZE = 6
NUM_PATCHES = (IMAGE_SIZE // PATCH_SIZE) ** 2
PROJECTION_DIM = 64
NUM_HEADS = 4
TRANSFORMER_LAYERS = 8
MLP_HEAD_UNITS = [2048, 1024]

class CreatePatchesLayer(torch.nn.Module):

  def __init__(
    self,
    patch_size: int,
    strides: int,
  ) -> None:
    super().__init__()
    self.unfold_layer = torch.nn.Unfold(
      kernel_size=patch_size, stride=strides
    )

  def forward(self, images: torch.Tensor) -> torch.Tensor:
    patched_images = self.unfold_layer(images)
    return patched_images.permute((0, 2, 1))

batch_of_images = next(iter(trainloader))[0][0].unsqueeze(dim=0)

plt.figure(figsize=(4, 4))
image = torch.permute(batch_of_images[0], (1, 2, 0)).numpy()
plt.imshow(image)
plt.axis("off")
plt.savefig("img.png", bbox_inches="tight", pad_inches=0)
plt.clf()

patch_layer = CreatePatchesLayer(patch_size=PATCH_SIZE, strides=PATCH_SIZE)
patched_image = patch_layer(batch_of_images)
patched_image = patched_image.squeeze()

plt.figure(figsize=(4, 4))
for idx, patch in enumerate(patched_image):
  ax = plt.subplot(NUM_PATCHES, NUM_PATCHES, idx + 1)
  patch_img = torch.reshape(patch, (3, PATCH_SIZE, PATCH_SIZE))
  patch_img = torch.permute(patch_img, (1, 2, 0))
  plt.imshow(patch_img.numpy())
  plt.axis("off")
plt.savefig("patched_img.png", bbox_inches="tight", pad_inches=0)