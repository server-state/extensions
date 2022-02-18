# `@server-state/mysql-status-extension`

!["Built for Server State" badge](https://img.shields.io/badge/Built%20for-Server%20State-%23ffc107)
![npm (scoped)](https://img.shields.io/npm/v/@server-state/mysql-status-extension)

## Overview

An extension adding the output of the MySQL "SHOW GLOBAL STATUS;" command to the GraphQL Schema

## Installation

This is intended to be installed on Server State servers.

Use the built-in functionalities to install this extension. For more details, please refer to the [Server State documentation](https://www.server-state.tech/docs/).

Alternatively, in your server, use `npm install @server-state/mysql-status-extension -w plugins` to manually install the extension.

## GraphQL Schema Extensions

<!--
This extension doesn't extend the Server State GraphQL schema.
-->

This extension extends the GraphQL schema. For technical details, please refer to [the schema extension definition](./src/schema.graphql).
