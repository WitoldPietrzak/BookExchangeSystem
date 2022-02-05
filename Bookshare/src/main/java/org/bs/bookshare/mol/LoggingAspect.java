package org.bs.bookshare.mol;

import lombok.extern.log4j.Log4j2;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@Log4j2
public class LoggingAspect {


    @Before("execution(* org.bs.bookshare.mok.service.AppUserServiceImplementation.*(..))) || execution(* org.bs.bookshare.moks.service.AppUserServiceImplementation.*(..))) || execution(* org.bs.bookshare.mop.service.AppUserServiceImplementation.*(..))) execution(* org.bs.bookshare.mol.service.AppUserServiceImplementation.*(..)))")
    public void logBeforeMethod(JoinPoint joinPoint){
        if(joinPoint.toString().toLowerCase().contains("passw")){
            log.info("Method "+joinPoint.toString()+" has been caled with arguments: ****");
        }
        else {
            log.info("Method "+joinPoint.toString()+" has been caled with arguments: "+ Arrays.toString(joinPoint.getArgs()));
        }

    }

    public void logAfterMethod(){

    }
}
