.. _module-clb-collab.clbCollabApp:

===========================
Namespace: ``clbCollabApp``
===========================

Member Of :doc:`module-clb-collab`

.. contents:: Local Navigation
   :local:

Children
========

.. toctree::
   :maxdepth: 1
   
   
Description
===========

clbCollabApp can be used to find and work with the
registered HBP Collaboratory applications.




Function ``list``
=================



.. js:function:: list()

    
    :return Promise: promise of the list of all applications
    


Function ``getById``
====================

Retrieve an App instance from its id.

.. js:function:: getById(id)

    
    :param number id: the app id
    :return Promise: promise of an app instance
    


Function ``findOne``
====================



.. js:function:: findOne(params)

    
    :param object params: query parameters
    :return Promise: promise of an App instance
    

