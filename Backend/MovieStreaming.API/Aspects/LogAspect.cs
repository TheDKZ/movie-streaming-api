using Microsoft.AspNetCore.Mvc.Filters;//kütüphanemiz

namespace MovieStreaming.API.Filters//LogAspect yapmanın temel amacı, uygulama genelindeki tüm API isteklerini tek bir merkezden, kod tekrarı yapmadan otomatik olarak loglamaktır.
{
    // 1. ActionFilterAttribute sınıfından miras alıyoruz
    public class LogAspect : ActionFilterAttribute //.net hazır sundugu action filter ozelligi kazandirir.
    {
        // 2. Metoda girmeden ÖNCE çalışacak kısım
        public override void OnActionExecuting(ActionExecutingContext context)//ActionFilterAttribute özel kendi metodudur.
        {                                     //ActionExecutingContext context: özel veritipi kütüphanede eklidir.
            var logger = context.HttpContext.RequestServices.GetService<ILogger<LogAspect>>();//Uygulama genelinde çalışan loglama motorunu (ILogger) bulup elimize almak.
            var actionName = context.ActionDescriptor.DisplayName;// bu kod nereye gidecegini ogreniyoruz
            logger.LogInformation("[Basladi] istek su metoda ulastı: {ActionName}", actionName);//Bu satır, ekrana veya log dosyasına "İstek falanca metoda ulaştı" bilgisini, .NET'in en performanslı ve endüstri standardı olan yapılandırılmış loglama yöntemiyle basmanı sağlar.
            base.OnActionExecuting(context);
        }

        // 3. Metot bittikten SONRA çalışacak kısım
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            // Buraya çıkış loglarımızı yazacağız
            var logger = context.HttpContext.RequestServices.GetService<ILogger<LogAspect>>();

            // 2. Hangi metodun (Action) işini bitirdiğini bul
            var actionName = context.ActionDescriptor.DisplayName;

            // 3. Çıkış logunu yazdır
            logger.LogInformation("[BİTTİ] Metot işlemini tamamladı: {ActionName}", actionName);
            base.OnActionExecuted(context);
        }
    }
}