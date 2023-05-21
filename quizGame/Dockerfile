# 
FROM python:3.9

# 
WORKDIR /

# 
COPY ./requirements.txt /requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r /requirements.txt

# 
COPY ./ /

# 
CMD ["uvicorn", "main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "80"]


# docker build -t myimage .
# docker run -d --name mycontainer -p 80:80 myimage
