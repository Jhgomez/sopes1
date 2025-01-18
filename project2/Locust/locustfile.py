import time, json, random, os
from locust import HttpUser, task

class PostCoursesTest(HttpUser):

  @task
  def post_grades(self):
    courses = []
    with open("courses.json", "r") as file:
      courses = json.load(file)
    
    for _ in range(len(courses)):
      assignation = courses.pop()
      print(assignation)
      response = self.client.post("http://34.174.102.23.nip.io/course", json=assignation, name="/coursePost")
      print(response.text)
      print(response.status_code)
      time.sleep(0.3)

  def on_start(self):
    os.system('oras pull --insecure core.harbor.sopes/sopes1/courses:latest')
    print("task started")

  def on_stop(self):
    os.system('del courses.json')
    print("task end")
