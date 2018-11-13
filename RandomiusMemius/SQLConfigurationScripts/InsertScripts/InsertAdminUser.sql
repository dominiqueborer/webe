USE [randomiusmemiusApp]
GO
DECLARE @salt UNIQUEIDENTIFIER=NEWID()
DECLARE @pPassword varchar(50)= 'admin'
INSERT INTO [dbo].[User]
           ([LoginName]
           ,[PasswordHash]
           ,[FirstName]
           ,[LastName]
           ,[Salt]
           ,[Mail]
           ,[UserRoleSetId]
           ,[Banned])
     VALUES
           ('admin'
           ,HASHBYTES('SHA2_512', @pPassword+CAST(@salt AS NVARCHAR(36)))
           ,'The Master'
           ,'Admin'
           ,@salt
           ,'noMailFor@admin.net'
           ,1
           ,0)
GO


