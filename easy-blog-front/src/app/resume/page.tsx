import "./page.scss";
import Link from "next/link";

export default function Resume() {
  return (
    <div className="w-full">
      <div className="relative max-w-5xl m-auto mt-8 mb-10">
        {/* 下载简历 */}
        <Link
          className="btn btn-danger absolute top-4 right-8  underline"
          href="/resume/resume.pdf"
          download
        >
          下载pdf简历
        </Link>
        <div
          id="resume"
          className="grid grid-cols-12 pt-4 pb-8 rounded shadow-sm bg-white"
        >
          {/* 简历左侧 */}
          <div className="px-8 py-6 pb-4 lg:col-span-7 md:col-span-12">
            {/* 个人信息 */}
            <h2 className="pb-1 text-2xl font-bold text-gray-700 border-b border-gray-200">
              个人信息
            </h2>
            <ul>
              <li className="my-1 text-base text-gray-600">
                姓名：
                <span className="text-gray-500 text">钟辉</span>
              </li>
              <li className="my-1 text-base text-gray-600">
                年龄：
                <span className="text-gray-500 text">26</span>
              </li>
              <li className="my-1 text-base text-gray-600">
                工作年限：
                <span className="text-gray-500 text">
                  1年前后端 + 3年全职前端
                </span>
              </li>
            </ul>
            {/* 教育经历 */}
            <h2 className="pb-1 mb-4 text-2xl font-bold text-gray-700 border-b border-gray-200">
              教育
            </h2>
            <h3 className="mt-5 mb-2 text-lg font-medium text-red-500">
              <a href="http://www.hubu.edu.cn/" target="_blank">
                湖北大学
              </a>
            </h3>
            <ul>
              <li className="text-base text-gray-600">
                学士，软件工程
                <span className="text-sm text-gray-500">[2013 - 2017]</span>
              </li>
            </ul>
            {/* 专业技能 */}
            <h2 className="pb-1 mb-4 text-2xl font-bold text-gray-700 border-b border-gray-200">
              专业技能
            </h2>
            <ol>
              <li className="my-1 text-base text-gray-600">
                <b>Vue2全家桶</b>：
                <span className="text-gray-500 text">
                  熟练掌握，工作中多次使用；
                </span>
              </li>
              <li className="my-1 text-base text-gray-600">
                <b>Vue3全家桶：</b>：
                <span className="text-gray-500 text">
                  熟练掌握，个人开源项目中多次使用；
                </span>
              </li>
              <li className="my-1 text-base text-gray-600">
                <b>React</b>和<b>React Hooks</b>：
                <span className="text-gray-500 text">
                  熟练掌握，在公司项目和个人项目多次使用；
                </span>
              </li>
              <li className="my-1 text-base text-gray-600">
                小程序：
                <span className="text-gray-500 text">
                  熟练使用<b>Uniapp</b>和<b>Taro</b>
                  ，在公司项目和个人项目开发了多个小程序；
                </span>
              </li>
              <li className="my-1 text-base text-gray-600">
                构建工具：
                <span className="text-gray-500 text">
                  熟练使用<b>Vite</b>和<b>Webpack</b>，了解前端性能优化手段；
                </span>
              </li>
              <li className="my-1 text-base text-gray-600">
                后端技术：
                <span className="text-gray-500 text">
                  熟悉<b>Node.js</b>、<b>PHP</b>、<b>Java</b>，熟悉<b>Nginx</b>
                  、pm2等；
                </span>
              </li>
            </ol>
            {/* 项目（工作） */}
            <h2 className="pb-1 mb-4 text-2xl font-bold text-gray-700 border-b border-gray-200">
              项目（工作）
            </h2>
            <h3>
              <span className="text-[17px] text-red-500 font-semibold">
                狮令部
              </span>
              <span className="px-1 font-semibold text-gray-700">—</span>
              <span className="text-[17px] text-gray-700 font-semibold">
                研发与维护
              </span>
              <span className="ml-2 text-sm text-gray-400">
                [2020.07 - 2021-09]
              </span>
            </h3>
            <ul>
              <li className="my-1 text-[15px] text-gray-600">
                公司内部最重要的汽配物流管理平台，是整个物流管理系统的枢纽部分，各个app、小程序端的业务都需要它的配合才能开展业务。项目涉及到了汽配物流的各个方面，包括：运输、运营、工单、财务、用户、决策等等，结合商家端、骑手端app、小程序构成了整个物流管理系统;
              </li>
              <li className="my-1 text-[15px] text-gray-600">
                狮令部项目前端部分经历了一次大型的技术改造，将最初由Vue2.x的项目和一个React
                +
                Hooks的项目整合成了一个统一的平台。随着项目的持续维护和演进，在不停地迭代新功能的同时处理掉用Vue2.x开发的功能的技术债;
              </li>
              <li className="my-1 text-[15px] text-gray-600">
                我主要负责项目的调度相关模块的功能开发与维护、与地图相关的各种功能的开发与维护;
              </li>
              <li className="my-1 text-[15px] text-gray-600">
                项目初期为项目添加了 <b>Eslint</b>+<b>Prettier</b>+
                <b>StyleLint</b>
                相关配置，格式化了旧代码，提升了新功能开发效率与并减少了代码维护的成本；
              </li>
              <li className="my-1 text-[15px] text-gray-600">
                整合 2 个系统的地图相关的功能中，使用 iframe 实现了 2
                个版本高德地图 api 共存，并使用 TypeScript
                重构和新开发了原本不兼容的地图相关功能；
              </li>
              <li className="my-1 text-[15px] text-gray-600">
                牵头重构了系统中用户使用占比<b>30% - 40%</b>
                的列表派单功能，不仅大大提升了此处代码的
                <i>
                  <b>可读性</b>
                </i>
                、
                <i>
                  <b>可维护性</b>
                </i>
                ，同时提升了列表派单页面的<b>10%</b>性能，稳步上线之后
                <i>没有出现任何线上问题</i>；
              </li>
            </ul>
            <h3>
              <span className="text-[17px] text-red-500 font-semibold">
                今日人才OA系统
              </span>
              <span className="px-1 font-semibold text-gray-700">—</span>
              <span className="text-[17px] text-gray-700 font-semibold">
                创建、研发与维护
              </span>
              <span className="ml-2 text-sm text-gray-400">
                [2018.08 - 2020-01]
              </span>
            </h3>
            <ul>
              <li className="my-1 text-[15px] text-gray-600">
                实现常规的OA功能，实现一键搜索各大招聘网站在线简历功能，实现了猎头日常工作的工作流
                ，结合爬虫和大数据技术实现了本地化简历库；
              </li>
              <li className="my-1 text-[15px] text-gray-600">
                项目的前端部分使用了 Vue2.x + Element ui
                的技术组合。我负责项目的搭建和基础功能的维护，并与其他前端同学负责项目新功能的开发、维护。
              </li>
            </ul>
            <h3>
              <span className="text-[17px] text-red-500 font-semibold">
                深圳市残联信息化平台一期项目
              </span>
              <span className="px-1 font-semibold text-gray-700">—</span>
              <span className="text-[17px] text-gray-700 font-semibold">
                创建与研发
              </span>
              <span className="ml-2 text-sm text-gray-400">
                [2019.10 - 2019-12]
              </span>
            </h3>
            <ul>
              <li className="my-1 text-[15px] text-gray-600">
                整个项目是把深圳市各个来源的残疾人数据以及残疾人机构数据进行分析，然后构建数据仓库并导入数据，再对数据进行分析并主要以各类图表进行可视化呈现，并按照对市、区、街道各个级别实现残疾人的日常管理功能（包括残疾人证管理、残疾人信息录入等等）。
              </li>
              <li className="my-1 text-[15px] text-gray-600">
                我独立完成了项目前端部分的搭建与开发，主要是做数据的可视化呈现；具体内容包括桌面端的后台系统和微信小程序的开发。
              </li>
              <li className="my-1 text-[15px] text-gray-600">
                桌面端的后台网站是基于<b>Vue</b>+<b>Element UI</b>
                开发，小程序则使用<b>Uniapp</b>
                进行开发；两者都需要对数据进行可视化呈现，都使用了<b>Echarts</b>
                作为数据可视化的开发框架。在项目中，我根据后端的数据格式，对各类图表进行了二次组件化封装，根据
                <b>Element UI</b>
                提供的组件二次开发了网站的左侧导航，对项目中表格、表单等交互性操作进行了优化。
              </li>
            </ul>
            {/* 项目（开源） */}
            <h2 className="pb-1 mb-4 text-2xl font-bold text-gray-700 border-b border-gray-200">
              项目（开源）
            </h2>
            <h3 className="mt-5 mb-2 text-lg font-medium text-red-500">
              <a href="https://music-player.immortalboy.cn/" target="_blank">
                仿网易云音乐播放器
              </a>
              <span className="ml-2 text-sm font-normal text-gray-400">
                [2018.08 - 2020-01]
              </span>
            </h3>
            <ul>
              <li className="text-base text-gray-600">
                基于<b>Vue3</b>、<b>Typescript</b>和<b>Vite</b>
                开发的仿网易云音乐客户端web版本。
              </li>
              <li className="text-base text-gray-600">
                UI参照了网易云音乐mac客户端，后端接口由开源项目提供，高度还原了网易云音乐。
              </li>
            </ul>
            {/* 工作 */}
            <h2 className="pb-1 mb-4 text-2xl font-bold text-gray-700 border-b border-gray-200">
              工作
            </h2>
            <h3>
              <span className="text-[17px] text-red-500 font-semibold">
                {" "}
                上海汉得
              </span>
              <span className="px-1 font-semibold text-gray-700">—</span>
              <span className="text-[17px] text-gray-700 font-semibold">
                技术顾问
              </span>
              <span className="ml-2 text-sm text-gray-400">
                [2017.07 - 2018-07]
              </span>
            </h3>
            <ul>
              <li className="my-1 text-[15px] text-gray-600">
                负责 CRM
                项目中微信服务号、企业微信应用、系统后台的开发和维护，其中企业微信应用提前通过验收；
              </li>
            </ul>
            <h3>
              <span className="text-[17px] text-red-500 font-semibold">
                {" "}
                深圳今日人才
              </span>
              <span className="px-1 font-semibold text-gray-700">—</span>
              <span className="text-[17px] text-gray-700 font-semibold">
                前端工程师
              </span>
              <span className="ml-2 text-sm text-gray-400">
                [2018.08 - 2020-05]
              </span>
            </h3>
            <ul>
              <li className="my-1 text-[15px] text-gray-600">
                负责公司各个前端项目的搭建、开发与维护，与前端同事一起开发和维护了多个项目，包括内部
                OA 系统、小程序，客户方的多个网站、信息化管理平台等等。
              </li>
            </ul>
            <h3>
              <span className="text-[17px] text-red-500 font-semibold">
                {" "}
                深圳开思时代
              </span>
              <span className="px-1 font-semibold text-gray-700">—</span>
              <span className="text-[17px] text-gray-700 font-semibold">
                前端工程师
              </span>
              <span className="ml-2 text-sm text-gray-400">
                [2020.07 - 至今]
              </span>
            </h3>
            <ul>
              <li className="my-1 text-[15px] text-gray-600">
                负责公司物流平台前端项目、商家工作台前端项目的研发工作。
              </li>
            </ul>
            {/* 我建的网站 */}
            <h2 className="pb-1 mb-4 text-2xl font-bold text-gray-700 border-b border-gray-200">
              我建的网站
            </h2>
            <h3 className="mt-5 mb-2 text-lg font-medium text-red-500">
              <a href="https://music-player.immortalboy.cn/" target="_blank">
                仿网易云音乐播放器
              </a>
              <span className="ml-2 text-sm font-normal text-gray-400">-</span>
              <span className="ml-2 text-sm font-normal text-gray-400">
                [2018.08 - 2020-01]
              </span>
            </h3>
            <ul>
              <li className="text-base text-gray-600">
                基于<b>Vue3</b>、<b>Typescript</b>和<b>Vite</b>
                开发的仿网易云音乐客户端web版本。
              </li>
            </ul>
            <h3 className="mt-5 mb-2 text-lg font-medium text-red-500">
              <a href="https://immortalboy.cn/" target="_blank">
                个人博客
              </a>
              <span className="ml-2 text-sm font-normal text-gray-400">-</span>
              <span className="ml-2 text-sm font-normal text-gray-400">
                [2021-10 - 至今]
              </span>
            </h3>
            <ul>
              <li className="text-base text-gray-600">
                使用<b>Vue3</b>、<b>egg.js</b>
                搭建，分享个人技术和生活的博客文章。
              </li>
            </ul>
          </div>
          {/* 简历右侧 */}
          <div className="col-span-5 py-6 ml-5 mr-8">
            {/* 联系方式 */}
            <h2 className="pb-1 mb-4 text-2xl font-bold text-gray-700 border-b border-gray-200">
              联系方式
            </h2>
            <ul>
              <li className="my-1 text-base text-gray-600">
                电话：
                <span className="text-gray-500 text">13720141463</span>
              </li>
              <li className="my-1 text-base text-gray-600">
                微信：
                <span className="text-gray-500 text">a13720141463</span>
              </li>
              <li className="my-1 text-base text-gray-600">
                邮箱：
                <a href="mailto:1126765590hui@gmail.com">
                  1126765590hui@gmail.com
                </a>
              </li>
              <li className="my-1 text-base text-gray-600">
                网站：
                <a
                  className="text-ellipsis"
                  href="https://immortalboy.cn"
                  target="_blank"
                >
                  https://immortalboy.cn
                </a>
              </li>
              <li className="my-1 text-base text-gray-600">
                网络上：
                <a
                  className="text-ellipsis"
                  href="https://github.com/programmerMark"
                  target="_blank"
                >
                  Github
                </a>
                、
                <a
                  className="flex-1 text-ellipsis"
                  href="https://juejin.cn/user/4212984287339021"
                  target="_blank"
                >
                  稀土掘金
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
