def train(model, train_loader, criterion, optimizer, device, epoch, writer):
    model.train()
    running_loss = 0.0
    total = 0
    correct = 0
    
    for batch_idx, (images, labels) in enumerate(train_loader):
        images = images.to(device)
        labels = labels.float().to(device).unsqueeze(1)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        total += labels.size(0)
        predicted = (outputs > 0.5).float()
        correct += (predicted == labels).sum().item()
    
    avg_loss = running_loss / len(train_loader)
    accuracy = correct / total
    print(f"Epoch {epoch} Train Loss: {avg_loss:.4f}, Accuracy: {accuracy:.4f}")
    
    # Logging to TensorBoard and WandB
    writer.add_scalar("Train/Loss", avg_loss, epoch)
    writer.add_scalar("Train/Accuracy", accuracy, epoch)
    wandb.log({"Train Loss": avg_loss, "Train Accuracy": accuracy, "epoch": epoch})
    
    return avg_loss, accuracy

def test(model, test_loader, criterion, device, epoch, writer):
    model.eval()
    running_loss = 0.0
    total = 0
    correct = 0
    
    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            labels = labels.float().to(device).unsqueeze(1)
            outputs = model(images)
            loss = criterion(outputs, labels)
            running_loss += loss.item()
            
            predicted = (outputs > 0.5).float()
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    
    avg_loss = running_loss / len(test_loader)
    accuracy = correct / total
    print(f"Epoch {epoch} Test Loss: {avg_loss:.4f}, Accuracy: {accuracy:.4f}")
    
    writer.add_scalar("Test/Loss", avg_loss, epoch)
    writer.add_scalar("Test/Accuracy", accuracy, epoch)
    wandb.log({"Test Loss": avg_loss, "Test Accuracy": accuracy, "epoch": epoch})
    
    return avg_loss, accuracy



