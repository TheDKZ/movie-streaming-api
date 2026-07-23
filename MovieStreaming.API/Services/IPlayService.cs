namespace MovieStreaming.API.Services
{
    public interface IPlayService
    {// Ne işe yarar: Hangi içeriğin (contentId), kim tarafından (userId) istendiğini
     // parametre olarak alıp, geriye oynatılacak video linkini string olarak dönecek şablon.
        string GetVideoUrl(int contentId, int userId);
    }
}
