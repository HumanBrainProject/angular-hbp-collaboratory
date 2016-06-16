.. _module-clb-collab.clbCollabNav:

===========================
Namespace: ``clbCollabNav``
===========================

Member Of :doc:`module-clb-collab`

.. contents:: Local Navigation
   :local:

Children
========

.. toctree::
   :maxdepth: 1
   
   module-clb-collab.clbCollabNav.NavItem
   
Description
===========

clbCollabNav provides tools to create and manage
      navigation items.




Function ``getRoot``
====================

Retrieve the root item of the given collab.

.. js:function:: getRoot(collabId)

    
    :param number collabId: collab ID
    :return Promise: promise the root nav item
    


Function ``getNode``
====================



.. js:function:: getNode(collabId, nodeId)

    
    :param number collabId: collab ID
    :param number nodeId: node ID
    :return NavItem: the matching nav item
    


Function ``getNodeFromContext``
===============================



.. js:function:: getNodeFromContext(ctx)

    
    :param str ctx: The context UUID
    :return Promise: The promise of a NavItem
    


Function ``addNode``
====================



.. js:function:: addNode(collabId, navItem)

    
    :param number collabId: collab ID
    :param number navItem: the NavItem instance to add to the navigation
    :return Promise: promise of the added NavItem instance
    


Function ``deleteNode``
=======================



.. js:function:: deleteNode(collabId, navItem)

    
    :param number collabId: collab ID
    :param NavItem navItem: the NavItem instance to remove from the navigation
    :return Promise: promise of an undefined item at the end
    


Function ``update``
===================



.. js:function:: update(collabId, navItem)

    
    :param number collabId: collab ID
    :param NavItem navItem: the instance to update
    :return Promise: promise the updated instance
    


Function ``insertNode``
=======================

Insert node in the three.

A queue is used to ensure that the insert operation does not conflict
on a single client.

.. js:function:: insertNode(collabId, navItem, parentItem, insertAt)

    
    :param int collabId: id of the collab
    :param NavItem navItem: Nav item instance
    :param NavItem parentItem: parent item
    :param int insertAt: add to the menu
    :return Promise: a promise that will
                             return the update nav item
    

