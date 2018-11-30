USE [randomiusmemiusApp]
GO

/****** Object:  StoredProcedure [dbo].[uspLogin]    Script Date: 30.11.2018 18:17:13 ******/
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


USE [randomiusmemiusApp]
GO

/****** Object:  StoredProcedure [dbo].[uspAddUser]    Script Date: 30.11.2018 18:17:43 ******/
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

/****** Object:  StoredProcedure [dbo].[getUsers]    Script Date: 30.11.2018 18:18:12 ******/
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

/****** Object:  StoredProcedure [dbo].[getUserById]    Script Date: 30.11.2018 18:18:21 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[getUserById]
    @userId int
AS
BEGIN

    SET NOCOUNT ON

	Select UserId, LoginName, FirstName, LastName, Mail, UserRoleSetId, Banned
	From dbo.[User]
	where dbo.[User].UserID = @userId

END
	
GO


USE [randomiusmemiusApp]
GO

/****** Object:  StoredProcedure [dbo].[getUser]    Script Date: 30.11.2018 18:18:30 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[getUser]
    @pLoginName NVARCHAR(254)
AS
BEGIN

    SET NOCOUNT ON

	Select UserId, LoginName, FirstName, LastName, Mail, UserRoleSetId, Banned
	From dbo.[User]
	where dbo.[User].LoginName = @pLoginName

END
	
GO


USE [randomiusmemiusApp]
GO

/****** Object:  StoredProcedure [dbo].[getMemes]    Script Date: 30.11.2018 18:18:39 ******/
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

	SELECT  RowConstrainedResult.Id,RowConstrainedResult.MemeTitle,RowConstrainedResult.MemeCreated,RowConstrainedResult.MemeFileName,RowConstrainedResult.UserUserID, Count(Distinct MemeCommentSet.Id) as CommentCount
FROM    ( SELECT    ROW_NUMBER() OVER ( ORDER BY MemeCreated DESC) AS RowNum, *
          FROM      MemeSet
        ) AS RowConstrainedResult		
		  Left Join MemeCommentSet
		  On RowConstrainedResult.Id = MemeCommentSet.MemeId
		  Left Join [User]
		  On RowConstrainedResult.UserUserID = [User].UserID
WHERE   RowNum >= (@page*@pageSize-(@pageSize+1))
    AND RowNum < (@page*@pageSize)
	Group by RowNum,RowConstrainedResult.Id,MemeTitle,MemeCreated,MemeFileName,RowConstrainedResult.UserUserID
ORDER BY RowNum
END
GO


USE [randomiusmemiusApp]
GO

/****** Object:  StoredProcedure [dbo].[getMemeComments]    Script Date: 30.11.2018 18:18:47 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[getMemeComments]
	-- Add the parameters for the stored procedure here

	@page int, 
	@pageSize int,
	@memeId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT  RowConstrainedResult.Id,RowConstrainedResult.Comment,RowConstrainedResult.Created,[User].LoginName 
FROM    ( SELECT    ROW_NUMBER() OVER ( ORDER BY Created DESC) AS RowNum, *
          FROM      MemeCommentSet
        ) AS RowConstrainedResult		
		  Left Join [User]
		  On [User].UserID = RowConstrainedResult.UserUserID
WHERE   RowNum >= (@page*@pageSize-(@pageSize+1))
    AND RowNum < (@page*@pageSize) and RowConstrainedResult.MemeId = @memeId
ORDER BY RowNum
END
GO


USE [randomiusmemiusApp]
GO

/****** Object:  StoredProcedure [dbo].[getMemeCommentPages]    Script Date: 30.11.2018 18:18:56 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[getMemeCommentPages]
	-- Add the parameters for the stored procedure here

	@pageSize int,
	@memeId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

SELECT    ceiling(cast(COUNT(*) as decimal)/@pageSize) as pages
          FROM      MemeCommentSet
WHERE  MemeId = @memeId
END
GO


USE [randomiusmemiusApp]
GO

/****** Object:  StoredProcedure [dbo].[getMeme]    Script Date: 30.11.2018 18:19:05 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[getMeme]
	-- Add the parameters for the stored procedure here
	
	@memeId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

Select MemeSet.Id,MemeSet.MemeCreated,MemeSet.MemeFileName,MemeSet.MemeTitle,[User].LoginName from MemeSet 
Left join [User]
On [User].UserId = MemeSet.UserUserId
where Id = @memeId ;
END
GO


USE [randomiusmemiusApp]
GO

/****** Object:  StoredProcedure [dbo].[findByUsername]    Script Date: 30.11.2018 18:19:14 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[findByUsername]
    @pLoginName NVARCHAR(254),
    @responseMessage NVARCHAR(250)='' OUTPUT
AS
BEGIN

    SET NOCOUNT ON

    DECLARE @userID INT

    IF EXISTS (SELECT TOP 1 UserID FROM [dbo].[User] WHERE LoginName=@pLoginName)
       SET @responseMessage='Username Exists'	
    ELSE
       SET @responseMessage='Invalid login'

END
	
GO


USE [randomiusmemiusApp]
GO

/****** Object:  StoredProcedure [dbo].[findByUserId]    Script Date: 30.11.2018 18:19:22 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[findByUserId]
    @userId int,
    @responseMessage NVARCHAR(250)='' OUTPUT
AS
BEGIN

    SET NOCOUNT ON

    

    IF EXISTS (SELECT TOP 1 UserID FROM [dbo].[User] WHERE UserID=@userId)
       SET @responseMessage='UserId Exists'	
    ELSE
       SET @responseMessage='Invalid login'

END
	
GO


