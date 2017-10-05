# com_cloudtemple_zimletplus

## What is it ? 

The zimletPlus zimlet allows the Zimbra user to add their own shortcuts to other websites. The shortcuts are represented by additional tabs that the user can easily access while browsing the webmail.

## How to make use of the zimlet

 * Click on the Zimlet + label in the Zimlet panel.
 * To create a new shortcut, simply type in the name you wish to give it and set it an url.
 * Validate your new shortcut(s) by clicking on the "Validate" button.
 
## Notes 
 
 * Not all websites can be integrated in a tab : some will deny the request to be embedded into an external Iframe. It has to do with the X-Frame-Option http header that the remote server has to allow.
 * Embedding an HTTP related Iframe into the HTTPS secured zimbra webmail might cause some issue while trying to access given shortcuts. In order to see those, one will have to disable the "Mixed Active Content" browser's security.
 




