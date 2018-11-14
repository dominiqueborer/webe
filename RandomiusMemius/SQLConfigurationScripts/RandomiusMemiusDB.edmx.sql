
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 11/14/2018 18:23:03
-- Generated from EDMX file: C:\Users\Administrator\source\repos\SQLDataRandomiusMemius\SQLDataRandomiusMemius\RandomiusMemiusDB.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [randomiusmemiusApp];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_MemeMemeComment]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MemeCommentSet] DROP CONSTRAINT [FK_MemeMemeComment];
GO
IF OBJECT_ID(N'[dbo].[FK_UserMeme]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MemeSet] DROP CONSTRAINT [FK_UserMeme];
GO
IF OBJECT_ID(N'[dbo].[FK_UserRoleSetUser]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[User] DROP CONSTRAINT [FK_UserRoleSetUser];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[MemeCommentSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[MemeCommentSet];
GO
IF OBJECT_ID(N'[dbo].[MemeSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[MemeSet];
GO
IF OBJECT_ID(N'[dbo].[User]', 'U') IS NOT NULL
    DROP TABLE [dbo].[User];
GO
IF OBJECT_ID(N'[dbo].[UserRoleSetSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[UserRoleSetSet];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'MemeCommentSet'
CREATE TABLE [dbo].[MemeCommentSet] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [Comment] nvarchar(max)  NOT NULL,
    [Created] datetime  NOT NULL,
    [MemeId] bigint  NOT NULL
);
GO

-- Creating table 'MemeSet'
CREATE TABLE [dbo].[MemeSet] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [MemeTitle] nvarchar(max)  NOT NULL,
    [MemeCreated] datetime  NOT NULL,
    [MemeFileName] nvarchar(max)  NOT NULL,
    [UserUserID] int  NOT NULL
);
GO

-- Creating table 'User'
CREATE TABLE [dbo].[User] (
    [UserID] int IDENTITY(1,1) NOT NULL,
    [LoginName] nvarchar(40)  NOT NULL,
    [PasswordHash] binary(64)  NOT NULL,
    [FirstName] nvarchar(40)  NULL,
    [LastName] nvarchar(40)  NULL,
    [Salt] uniqueidentifier  NULL,
    [Mail] nvarchar(max)  NOT NULL,
    [UserRoleSetId] int  NOT NULL,
    [Banned] bit  NOT NULL
);
GO

-- Creating table 'UserRoleSetSet'
CREATE TABLE [dbo].[UserRoleSetSet] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(max)  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'MemeCommentSet'
ALTER TABLE [dbo].[MemeCommentSet]
ADD CONSTRAINT [PK_MemeCommentSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'MemeSet'
ALTER TABLE [dbo].[MemeSet]
ADD CONSTRAINT [PK_MemeSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [UserID] in table 'User'
ALTER TABLE [dbo].[User]
ADD CONSTRAINT [PK_User]
    PRIMARY KEY CLUSTERED ([UserID] ASC);
GO

-- Creating primary key on [Id] in table 'UserRoleSetSet'
ALTER TABLE [dbo].[UserRoleSetSet]
ADD CONSTRAINT [PK_UserRoleSetSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [MemeId] in table 'MemeCommentSet'
ALTER TABLE [dbo].[MemeCommentSet]
ADD CONSTRAINT [FK_MemeMemeComment]
    FOREIGN KEY ([MemeId])
    REFERENCES [dbo].[MemeSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MemeMemeComment'
CREATE INDEX [IX_FK_MemeMemeComment]
ON [dbo].[MemeCommentSet]
    ([MemeId]);
GO

-- Creating foreign key on [UserUserID] in table 'MemeSet'
ALTER TABLE [dbo].[MemeSet]
ADD CONSTRAINT [FK_UserMeme]
    FOREIGN KEY ([UserUserID])
    REFERENCES [dbo].[User]
        ([UserID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_UserMeme'
CREATE INDEX [IX_FK_UserMeme]
ON [dbo].[MemeSet]
    ([UserUserID]);
GO

-- Creating foreign key on [UserRoleSetId] in table 'User'
ALTER TABLE [dbo].[User]
ADD CONSTRAINT [FK_UserRoleSetUser]
    FOREIGN KEY ([UserRoleSetId])
    REFERENCES [dbo].[UserRoleSetSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_UserRoleSetUser'
CREATE INDEX [IX_FK_UserRoleSetUser]
ON [dbo].[User]
    ([UserRoleSetId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------