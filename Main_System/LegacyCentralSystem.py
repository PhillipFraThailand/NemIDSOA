# Phillip Eismark

import pandas as pd
from pandas.io import json
import requests
import random
import msgpack

class LegacyCentralSystem(object):
    server_url = 'http://localhost:8080/nemId'
    file_name = '/Users/phillipeismark/Documents/SystemIntegration/si_mandatory_assignment_1/Main_System/people.csv'    
    xml_body = """
    <?xml version="1.0"?>
        <Person>
            <FirstName>{}</FirstName>
            <LastName>{}</LastName>
            <CprNumber>{}</CprNumber>
            <Email>{}</Email>
        </Person>"""
    person = {
        'name':None, 'lastName':None,
        'dateOfBirth':None,'email':None,
        'country':None,'phone':None,
        'address':None,'cpr':None,
        'nemId':None
    }

# read file and create and send xml object
    @classmethod
    def read_csv(self):
        # read the csv file
        df = pd.read_csv(LegacyCentralSystem().file_name)

        # for each row in the csv...
        for index,row in df.iterrows():
            print('building a person ...')
            # populate person with all the information from the csv - still need NemID and CPR though...
            person = LegacyCentralSystem().person['name'], LegacyCentralSystem().person['lastName'], LegacyCentralSystem().person['dateOfBirth'], LegacyCentralSystem().person['email'], LegacyCentralSystem().person['country'], LegacyCentralSystem().person['phone'], LegacyCentralSystem().person['address'] = str(row['FirstName']), str(row['LastName']),str(row['DateOfBirth']),str(row['Email']),str(row['Country']), str(row['Phone']),str(row['Address'])

            # get all the variables ready except for NemID and CPR
            name, lastName, dateOfBirth, email, country, phone, address = str(row['FirstName']), str(row['LastName']),str(row['DateOfBirth']),str(row['Email']),str(row['Country']), str(row['Phone']),str(row['Address'])

            # finish the cpr by replacing the - in DateOfBirth and adding a - with 4 random numbers
            LegacyCentralSystem().person['cpr'] = str(LegacyCentralSystem().person['dateOfBirth']).replace('-','') + '-' + str(random.randint(1000,9999))

            # create the xml object to send to retrieve the NemID
            xmlPerson = LegacyCentralSystem().xml_body.format(LegacyCentralSystem().person['name'], LegacyCentralSystem().person['lastName'], LegacyCentralSystem().person['cpr'], LegacyCentralSystem().person['email'])

            # print to verify
            print(LegacyCentralSystem().person)
            
            # maybe create a new method for this and call read_csv.
            # call the method that retrieves NemID
            print("calling retrieve_nemId")
            NemID = LegacyCentralSystem().retrieve_nemId(xmlPerson)

            # serialize it all in a json object and pass the json to the save_as_msgPack method to save it all
            # json_person = json.dumps()


# send the xml object to the nemID service to get a nemId
    @classmethod
    def retrieve_nemId(self, xmlPerson):
        print('sending post request to: ', LegacyCentralSystem().server_url, 'with: ', xmlPerson)
        nemId = requests.post('http://localhost:8080/nemId',xmlPerson)


# serialize json and save as msgpack with returned nemid
    @classmethod
    def save_as_msgPack(selv, person): 
        jsonDump = json.dumps(person)
        with open('{}.msgpack'.format(LegacyCentralSystem().person['cpr']),'wb') as f:
            msgpack.dump(jsonDump)


if __name__ == "__main__":
    LegacyCentralSystem().read_csv()
