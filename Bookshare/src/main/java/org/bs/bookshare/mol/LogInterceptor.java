package org.bs.bookshare.mol;

import lombok.extern.log4j.Log4j2;
import org.bs.bookshare.utils.IpAddressRetriever;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Enumeration;

@Log4j2
public class LogInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        log.info("Request of type "+request.getMethod() +" called using endpoint "+request.getRequestURI()+getParameters(request));
        return true;


    }


    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        String params = getParameters(request);
        log.info("Request of type "+request.getMethod() +" called using endpoint "+request.getRequestURI()+getParameters(request)+ " received response with status: "+String.valueOf(response.getStatus()));
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        if (ex != null){
            ex.printStackTrace();
            log.error("Request of type "+request.getMethod() +" called using endpoint "+request.getRequestURI()+getParameters(request)+" encountered exception: "+ex);
        }
        else {
            log.info("Request of type "+request.getMethod() +" called using endpoint "+request.getRequestURI()+getParameters(request)+" encountered no exceptions");
        }

    }


    private String getParameters(HttpServletRequest request) {
        StringBuffer posted = new StringBuffer();
        Enumeration<?> e = request.getParameterNames();
        String ip = request.getHeader("X-FORWARDED-FOR");
        String ipAddr = (ip == null) ? IpAddressRetriever.getClientIpAddressFromHttpServletRequest(request) : ip;
        String caller ="system";
        if(SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null && SecurityContextHolder.getContext().getAuthentication().getPrincipal() != null){
            caller = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        }

        if(caller != null){
            posted.append(" by user=").append(caller);
        }

        if (ipAddr!=null && !ipAddr.equals("")) {
            posted.append(" from IP=").append(ipAddr);
        }
        if (e == null || !e.hasMoreElements()) {
            return posted.toString();
        }
        else {
            posted.append(" with parameters: ");
        }
        while (e.hasMoreElements()) {
            if (posted.length() > 1) {
                posted.append(", ");
            }
            String curr = (String) e.nextElement();
            posted.append(curr).append("=");
            if (curr.contains("password")) {
                posted.append("*****");
            } else {
                posted.append(request.getParameter(curr));
            }
        }
        return posted.toString();
    }

}
