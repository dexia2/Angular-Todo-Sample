using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebSinglePageSample_API.Model;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WebSinglePageSample_API.Controllers
{
    /// <summary>
    /// Todoリストコントローラー
    /// </summary>
    [Route("api/[controller]")]
    public class TodoController : Controller
    {
        /// <summary>
        /// Todoリストの取得
        /// </summary>
        /// <returns>Todoリスト</returns>
        [HttpGet]
        public IEnumerable<Todo> Get()
        {
            return new List<Todo>{
                new Todo { complete = false, what ="リファクタリング"},
                new Todo { complete = false, what ="パフォーマンス改善"},
                new Todo { complete = false, what ="バグ管理台帳記入"},
                new Todo { complete = true, what ="本番環境デプロイ"},
                new Todo { complete = false, what ="ブログ書く"}
                    };
        }
    }
}
