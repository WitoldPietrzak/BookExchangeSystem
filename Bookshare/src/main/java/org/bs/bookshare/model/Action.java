package org.bs.bookshare.model;

import java.time.LocalDateTime;

public class Action {
    LocalDateTime dateTime;
    Boolean anonymous;
    ActionType actionType;
    User user;
}
