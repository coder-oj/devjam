import pickle
import sys

file = open('model.pkl', 'rb')
clf = pickle.load(file)
file.close()

print("Inside predict.py file")
userdata = [sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6]
                sys.argv[7], sys.argv[8], sys.argv[9], sys.argv[10], sys.argv[11], 
                sys.argv[12], sys.argv[13], sys.argv[14], sys.argv[15], sys.argv[16]
                , sys.argv[17], sys.argv[18], sys.argv[19] ]

for item in userdata:
    print(item)
    
print("Model is predicting")
print(clf.predict([userdata]))