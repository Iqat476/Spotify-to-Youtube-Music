# Use the official Python image as the base
FROM python:3.10

# Set the working directory in the container
WORKDIR /app

# Copy the project files into the container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Set the Flask entry point
CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]