import random, io, json

class GradesJsonGenerator:

  def _getRegion(self):
    return random.choice(["METROPOLITANA", "NORTE", "NORORIENTAL", "SURORIENTAL", "CENTRAL", "SUROCCIDENTAL", "NOROCCIDENTAL", "PETEN"])

  def _generateIngenieria(self, fileName, entries):
    cursos = ["SO1", "IA", "LAB", "SA", "OLC2"]
    carrera = ["Sistemas", "Industrial", "Quimica", "Civil"]
    
    for x in range(int(entries)):
      gradeEntry = { 'curso': random.choice(cursos), 'facultad': "Ingenieria", 'carrera': random.choice(carrera), 'region': self._getRegion() }
      self.grades.append(gradeEntry)



    
  def _generateMedicina(self, fileName, entries):
# "Inyecciones", "PA2", "PED"
    cursos = ["MD1", "MG"]
    carrera = ["General", "Pediatria", "Cirugia", "Oftalmologia"]
    
    for x in range(int(entries)):
      gradeEntry = { 'curso': random.choice(cursos), 'facultad': "Medicina", 'carrera': random.choice(carrera), 'region': self._getRegion() }
      self.grades.append(gradeEntry)




  # def _generateArquitectura(self, fileName, entries):
  #   cursos = ["Autocad", "Logos", "Planos", "Medidas", "Estructuras"]
  #   carrera = ["Diseño Grafico", "Interiores", "Exteriores", "Arquitecto"]
    
  #   for x in range(int(entries)):
  #     gradeEntry = { 'curso': random.choice(cursos), 'facultad': "Arquitectura", 'carrera': random.choice(carrera), 'region': self._getRegion() }
  #     self.grades.append(gradeEntry)

      

  # def _generateHumanidades(self, fileName, entries):
  #   cursos = ["M1", "Filo2", "TS1", "H2", "Soci2"]
  #   carrera = ["Pedadogia", "Arte", "Filosofia", "Trabajador Social"]
    
  #   for x in range(int(entries)):
  #     gradeEntry = { 'curso': random.choice(cursos), 'facultad': "Humanidades", 'carrera': random.choice(carrera), 'region': self._getRegion() }
  #     self.grades.append(gradeEntry)




  def __init__(self, fileName, entries):
    self.grades = []
    self._generateIngenieria(fileName, entries*0.4)
    # self._generateArquitectura(fileName, entries*0.3)
    self._generateMedicina(fileName, entries*0.2)
    # self._generateHumanidades(fileName, entries*0.1)

    with open(f"./{fileName}.json", 'w') as file:
      json.dump(self.grades, file, indent = 2, ensure_ascii=False)


generator = GradesJsonGenerator("courses", 1000)        