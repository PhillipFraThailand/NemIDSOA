# Phillip Eismark

import pandas as pd
from pandas.io import json
import requests
import random
import msgpack
import xml.etree.ElementTree as ET
from xml.dom import minidom

server_url = 'http://localhost:8080/nemId'
file_name = '/Users/phillipeismark/Documents/SystemIntegration/si_mandatory_assignment_1/Main_System/people.csv'    


# read file and create and send xml object
def read_csv():
    # read the csv file
    df = pd.read_csv(file_name)

    # for each row in the csv...
    for index,row in df.iterrows():
        print('building a person ...')

        root = ET.Element('Person')
        subFirstName = ET.SubElement(root, 'FirstName')
        subFirstName.text = str(row['FirstName'])
        subLastName = ET.SubElement(root, 'LastName')
        subLastName.text = str(row['LastName'])
        subCpr = ET.SubElement(root, 'cprnumber')
        subCpr.text = str(row['DateOfBirth']).replace('-','') + '-' + str(random.randint(1000,9999))
        subEmail = ET.SubElement(root, 'email')
        subEmail.text = str(row['Email'])

        objectThing = prettify(root)
        print(objectThing)

        # send the xml object to the nemID service to get a nemId
        response = requests.post('http://localhost:8080/nemId',data = ET.tostring(root), headers= {"Content-Type": "text/xml"})
        nemId = json.loads(response.text)
        
        # save ToMsgPack
        saveToMsgPack(nemId, subCpr.text)


def saveToMsgPack (jsonObject, cpr):
    with open('{}.msgpack'.format(cpr), 'wb') as f:
        objectToSave = msgpack.packb(jsonObject)
        f.write(objectToSave)
        print('saved msgpack')


def prettify(elem):
    rough_string = ET.tostring(elem, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

if __name__ == "__main__":
    read_csv()



# python3 /Users/phillipeismark/Documents/SystemIntegration/si_mandatory_assignment_1/Main_System/LegacyCentralSystem.py
