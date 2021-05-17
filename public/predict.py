
print("Inside python file")

import sys
print("Inside python file 2 ")
import pandas as pd
print("Inside python file 3 ")
from sklearn.model_selection import train_test_split
from sklearn import tree
from sklearn.metrics import confusion_matrix,accuracy_score

print("Inside python file hfsdhfkjsdhfkjsd ")

# if __name__ == "__main__":



#     for item in userdata:
#         print(item)

#     print("Inside predict.py file")

#     file = open('./model.pkl', 'rb')
#     print("Inside predict.py file2")
#     clf = pickle.load(file)
#     print("Inside predict.py file4")
#     file.close()

    
#     print("Model is predicting")
#     print(clf.predict([userdata]))



def analysis():
    print("Inside analysis")
    userdata = [sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6], sys.argv[7], sys.argv[8], sys.argv[9], sys.argv[10], sys.argv[11], sys.argv[12], sys.argv[13], sys.argv[14], sys.argv[15], sys.argv[16], sys.argv[17], sys.argv[18], sys.argv[19] ]
    df = pd.read_csv('mldata.csv')

    print("Dataset Loaded successfully!")
    # Number Encoding
    cols = df[["self-learning capability?", "Extra-courses did","Taken inputs from seniors or elders", "worked in teams ever?", "Introvert"]]
    for i in cols:
        cleanup_nums = {i: {"yes": 1, "no": 0}}
        df = df.replace(cleanup_nums)
   

    mycol = df[["reading and writing skills", "memory capability score"]]
    for i in mycol:
        cleanup_nums = {i: {"poor": 0, "medium": 1, "excellent": 2}}
        df = df.replace(cleanup_nums)


    # Label Encoding
    category_cols = df[['certifications', 'workshops', 'Interested subjects', 'interested career area ', 'Type of company want to settle in?', 
                        'Interested Type of Books']]
    for i in category_cols:
        df[i] = df[i].astype('category')
        df[i + "_code"] = df[i].cat.codes


    # Dummy Variable Encoding
    df = pd.get_dummies(df, columns=["Management or Technical", "hard/smart worker"], prefix=["A", "B"])


    # Building Model
    feed = df[['Logical quotient rating', 'hackathons', 'coding skills rating', 'public speaking points', 'self-learning capability?','Extra-courses did', 
            'reading and writing skills', 'memory capability score', 'Taken inputs from seniors or elders', 'worked in teams ever?', 
            'Introvert','certifications_code', 'workshops_code', 'Interested subjects_code', 'interested career area _code', 
            'Type of company want to settle in?_code', 'Interested Type of Books_code', 'A_Management', 'A_Technical', 'B_hard worker', 'B_smart worker', 'Suggested Job Role']]


    # Taking all independent variable columns
    df_train_x = feed.drop('Suggested Job Role',axis = 1)

    # Target variable column
    df_train_y = feed['Suggested Job Role']

    # Train-Test Splitting
    x_train, x_test, y_train, y_test = train_test_split(df_train_x, df_train_y, test_size=0.20, random_state=42)


    # Decision Tree Classifier
    clf = tree.DecisionTreeClassifier()
    clf = clf.fit(x_train, y_train)

    print("Model Built!")

if __name__ == "__main__":
    print("Inside main")
    analysis()
    