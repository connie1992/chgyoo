package com.chgyoo.barret.service;

/**
 * @author genchun.xiong01
 * Date: 2019/5/8
 */
public interface LockSeatService {

    boolean lockSeat(String weixinId, String[] seatIds);
}
