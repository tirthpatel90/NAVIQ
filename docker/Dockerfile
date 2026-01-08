# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the backend code and install dependencies from requirements
COPY backend/ /app/backend
RUN pip install --no-cache-dir -r backend/requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Ensure the backend package can be resolved and run the API server
ENV PYTHONPATH=/app
CMD ["python", "-m", "backend.app"]
