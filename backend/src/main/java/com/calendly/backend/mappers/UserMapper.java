package com.calendly.backend.mappers;

import com.calendly.backend.dtos.SignUpDto;
import com.calendly.backend.dtos.UserDto;
import com.calendly.backend.entites.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(User user);

    @Mapping(target = "password", ignore = true)
    User signUpToUser(SignUpDto signUpDto);

}
