USE [randomiusmemiusApp]
GO

DECLARE	@return_value int,
		@responseMessage nvarchar(250)

EXEC	@return_value = [dbo].[uspAddUser]
		@pLogin = N'Jack',
		@pPassword = N'secret',
		@pFirstName = N'Jack',
		@pLastName = N'No5',
		@responseMessage = @responseMessage OUTPUT,
		@pMail = N'jack@crap.net'

SELECT	@responseMessage as N'@responseMessage'

SELECT	'Return Value' = @return_value


EXEC	@return_value = [dbo].[uspAddUser]
		@pLogin = N'Danny',
		@pPassword = N'secret',
		@pFirstName = N'Danny',
		@pLastName = N'G',
		@responseMessage = @responseMessage OUTPUT,
		@pMail = N'danny@g.net'

SELECT	@responseMessage as N'@responseMessage'

SELECT	'Return Value' = @return_value
GO
