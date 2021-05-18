#Importing Libraries
import sys
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn import tree, svm
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix,accuracy_score


#Loading Dataset
df = pd.read_csv("https://raw.githubusercontent.com/coder-oj/devjam/main/public/mldata.csv")


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
feed = df[['Logical quotient rating', 'coding skills rating', 'hackathons', 'public speaking points', 'self-learning capability?','Extra-courses did', 
           'Taken inputs from seniors or elders', 'worked in teams ever?', 'Introvert', 'reading and writing skills', 'memory capability score',  
           'B_hard worker', 'B_smart worker', 'A_Management', 'A_Technical', 'Interested subjects_code', 'Interested Type of Books_code', 'certifications_code', 
           'workshops_code', 'Type of company want to settle in?_code',  'interested career area _code',
             'Suggested Job Role']]


# Taking all independent variable columns
df_train_x = feed.drop('Suggested Job Role',axis = 1)

# Target variable column
df_train_y = feed['Suggested Job Role']

# Train-Test Splitting
x_train, x_test, y_train, y_test = train_test_split(df_train_x, df_train_y, test_size=0.20, random_state=42)


# Decision Tree Classifier
clf1 = tree.DecisionTreeClassifier()
clf1 = clf1.fit(x_train, y_train)

# SVM Classifier
clf2 = svm.SVC()
clf2 = clf2.fit(x_train, y_train)


#Random Forest Classifier
clf3 = RandomForestClassifier(n_estimators=100) 
clf3 = clf3.fit(x_train, y_train)


# feed = df[['Logical quotient rating', 'coding skills rating', 'hackathons', 'public speaking points', 'self-learning capability?','Extra-courses did', 
#            'Taken inputs from seniors or elders', 'worked in teams ever?', 'Introvert', 'reading and writing skills', 'memory capability score',  
#            'B_hard worker', 'B_smart worker', 'A_Management', 'A_Technical', 'Interested subjects_code', 'Interested Type of Books_code', 'certifications_code', 
#            'workshops_code', 'Type of company want to settle in?_code',  'interested career area _code',
#              'Suggested Job Role']]

# Network Security Engineer
# print(clf.predict([['1','1','1','1','1','0','1', '2', '1', '1', '0', '3','3', 
#                     '4','4','2','7','0','1','0','1']])) 

userdata = [[sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6], sys.argv[7], sys.argv[8], sys.argv[9], sys.argv[10], sys.argv[11], sys.argv[12], sys.argv[13], sys.argv[14], sys.argv[15], sys.argv[16], sys.argv[17], sys.argv[18], sys.argv[19],sys.argv[20],sys.argv[21] ]]

print("Prediction By Decision Tree = " , clf1.predict(userdata)) 
print("Prediction By SVM = " , clf2.predict(userdata)) 
print("Prediction By Random Forest = " , clf3.predict(userdata)) 


