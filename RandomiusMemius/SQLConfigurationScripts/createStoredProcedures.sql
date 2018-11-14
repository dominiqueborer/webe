USE [randomiusmemiusApp]
GO

/****** Object:  StoredProcedure [dbo].[getMemes]    Script Date: 14.11.2018 18:26:28 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[getMemes]
	-- Add the parameters for the stored procedure here

	@page int, 
	@pageSize int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT  Id,MemeTitle,MemeCreated,MemeFileName,UserUserID
FROM    ( SELECT    ROW_NUMBER() OVER ( ORDER BY MemeCreated DESC) AS RowNum, *
          FROM      MemeSet
        ) AS RowConstrainedResult
WHERE   RowNum >= (@page*@pageSize-(@pageSize+1))
    AND RowNum < (@page*@pageSize)
ORDER BY RowNum
END
GO


USE [randomiusmemiusApp]
GO

/****** Object:  StoredProcedure [dbo].[getUsers]    Script Date: 14.11.2018 18:27:17 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[getUsers]
	-- Add the parameters for the stored procedure here

	@page int, 
	@pageSize int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT  UserID,LoginName,FirstName,LastName,Mail,Banned,Name
FROM    ( SELECT    ROW_NUMBER() OVER ( ORDER BY LoginName) AS RowNum, *
            FROM [randomiusmemiusApp].[dbo].[User] LEFT JOIN UserRoleSetSet
			ON [User].UserRoleSetId = UserRoleSetSet.Id
        ) AS RowConstrainedResult
WHERE   RowNum >= (@page*@pageSize-(@pageSize+1))
    AND RowNum < (@page*@pageSize)
ORDER BY RowNum
END
GO

USE [randomiusmemiusApp]
GO

/****** Object:  StoredProcedure [dbo].[uspAddUser]    Script Date: 14.11.2018 18:27:32 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[uspAddUser]
    @pLogin NVARCHAR(50), 
    @pPassword NVARCHAR(50),
    @pFirstName NVARCHAR(40) = NULL, 
    @pLastName NVARCHAR(40) = NULL,
    @responseMessage NVARCHAR(250) OUTPUT,
    @pMail NVARCHAR(40) = NULL
AS
BEGIN
    SET NOCOUNT ON

    DECLARE @salt UNIQUEIDENTIFIER=NEWID()
    BEGIN TRY

        INSERT INTO dbo.[User] (LoginName, PasswordHash, Salt, FirstName, LastName,Mail,Banned,UserRoleSetId)
        VALUES(@pLogin, HASHBYTES('SHA2_512', @pPassword+CAST(@salt AS NVARCHAR(36))), @salt, @pFirstName, @pLastName,@pMail,0,2)

       SET @responseMessage='Success'

    END TRY
    BEGIN CATCH
        SET @responseMessage=ERROR_MESSAGE() 
    END CATCH

END
GO
USE [randomiusmemiusApp]
GO

/****** Object:  StoredProcedure [dbo].[uspLogin]    Script Date: 14.11.2018 18:27:49 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[uspLogin]
    @pLoginName NVARCHAR(254),
    @pPassword NVARCHAR(50),
    @responseMessage NVARCHAR(250)='' OUTPUT
AS
BEGIN

    SET NOCOUNT ON

    DECLARE @userID INT

    IF EXISTS (SELECT TOP 1 UserID FROM [dbo].[User] WHERE LoginName=@pLoginName)
    BEGIN
        SET @userID=(SELECT UserID FROM [dbo].[User] WHERE LoginName=@pLoginName AND PasswordHash=HASHBYTES('SHA2_512', @pPassword+CAST(Salt AS NVARCHAR(36))))

       IF(@userID IS NULL)
           SET @responseMessage='Incorrect password'
       ELSE 
           SET @responseMessage='User successfully logged in'
    END
    ELSE
       SET @responseMessage='Invalid login'

END
	
GO





