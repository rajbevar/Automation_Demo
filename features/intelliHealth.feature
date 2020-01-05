@intelli
Feature: Navigate to intelli health portal
  As an internet user
  In order to find out more about the itunes vote cards app
  I want to be able to search for information about the itunes vote cards app
  
  @TD-2 @TD-1 @intelli @smoke
  Scenario Outline: Navigate to intelli health portal 
   Given the following <role> user exists with alias : <patientalias> else create: <create>
   When I navigate to intelli health portal
   And I selected the patient: <patientalias>
   And I selected the <tabName> tab from patient dashboard
   Then I added medications: <medicationAlias> for the patient: <patientalias>
   And patient <patientalias> confirms added medication in mobile app

   Examples: 
		| scenario_id | description | patientalias | role | create | tabName | medicationAlias |
		| 01 | verify the portal user can select the patient and create medications and view them in mobile app | james1 | patient | true | medications | Amlodipine |

