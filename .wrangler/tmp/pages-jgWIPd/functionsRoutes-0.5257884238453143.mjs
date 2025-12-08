import { onRequest as __api_ai_insight_js_onRequest } from "/Users/home/Documents/Antigravity/functions/api/ai-insight.js"
import { onRequest as __api_chart_js_onRequest } from "/Users/home/Documents/Antigravity/functions/api/chart.js"
import { onRequest as __api_chatbot_js_onRequest } from "/Users/home/Documents/Antigravity/functions/api/chatbot.js"
import { onRequest as __api_debug_js_onRequest } from "/Users/home/Documents/Antigravity/functions/api/debug.js"
import { onRequest as __api_news_js_onRequest } from "/Users/home/Documents/Antigravity/functions/api/news.js"
import { onRequest as __api_proxy_image_js_onRequest } from "/Users/home/Documents/Antigravity/functions/api/proxy-image.js"
import { onRequest as __api_stock_profile_js_onRequest } from "/Users/home/Documents/Antigravity/functions/api/stock-profile.js"
import { onRequest as __api_stocks_js_onRequest } from "/Users/home/Documents/Antigravity/functions/api/stocks.js"
import { onRequest as __api_translate_js_onRequest } from "/Users/home/Documents/Antigravity/functions/api/translate.js"
import { onRequest as __api_x_community_js_onRequest } from "/Users/home/Documents/Antigravity/functions/api/x-community.js"

export const routes = [
    {
      routePath: "/api/ai-insight",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_ai_insight_js_onRequest],
    },
  {
      routePath: "/api/chart",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_chart_js_onRequest],
    },
  {
      routePath: "/api/chatbot",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_chatbot_js_onRequest],
    },
  {
      routePath: "/api/debug",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_debug_js_onRequest],
    },
  {
      routePath: "/api/news",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_news_js_onRequest],
    },
  {
      routePath: "/api/proxy-image",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_proxy_image_js_onRequest],
    },
  {
      routePath: "/api/stock-profile",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_stock_profile_js_onRequest],
    },
  {
      routePath: "/api/stocks",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_stocks_js_onRequest],
    },
  {
      routePath: "/api/translate",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_translate_js_onRequest],
    },
  {
      routePath: "/api/x-community",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_x_community_js_onRequest],
    },
  ]