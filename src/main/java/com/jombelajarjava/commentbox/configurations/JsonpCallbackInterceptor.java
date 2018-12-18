package com.jombelajarjava.commentbox.configurations;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Component
public class JsonpCallbackInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {
        Map<String, String[]> params = request.getParameterMap();
        boolean hasCallback = params.containsKey("callback");

        if (hasCallback) {
            String callback = params.get("callback")[0];
            response.getOutputStream().print(callback + "(");
        }

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView modelAndView) throws Exception {
        Map<String, String[]> params = request.getParameterMap();
        boolean hasCallback = params.containsKey("callback");

        if (hasCallback) {
            response.getOutputStream().print(");");
        }
    }
}
