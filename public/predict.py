import pickle

file = open('model.pkl', 'rb')
clf = pickle.load(file)
file.close()

if request.method == "POST":
        myDict = request.form
        feature1 = myDict['featurename']